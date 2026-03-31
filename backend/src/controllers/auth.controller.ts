import { Request, Response } from 'express';
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import emailService from '../services/email.service';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * POST /api/auth/register
 * Register a new user and send verification email.
 */
export const register = async (req: Request, res: Response) => {
  let newUser;
  try {
    const { email, password, name } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // 2. Generate verification token and hash password
    const token = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user in database
    newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        verificationToken: token,
        role: 'USER',
        verified: false
      },
    });

    // 4. Send the verification email (wrapped separately for clearer error logging)
    try {
      await emailService.sendVerificationEmail(email, name, token);
    } catch (emailError: any) {
      // Log the real SMTP error so you can see it in Render logs
      console.error("❌ EMAIL SENDING FAILED:");
      console.error("  Message:", emailError?.message);
      console.error("  Code:", emailError?.code);
      console.error("  Command:", emailError?.command);
      console.error("  Full error:", JSON.stringify(emailError, null, 2));

      // Clean up: delete user so email isn't locked without verification
      await prisma.user.delete({ where: { id: newUser.id } });

      return res.status(500).json({
        success: false,
        message: "Registration succeeded but verification email failed. Please try again later.",
        // Only expose error details in development
        ...(process.env.NODE_ENV !== 'production' && { debug: emailError?.message })
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email to verify your account."
    });

  } catch (error: any) {
    // Catches DB errors, bcrypt errors, etc.
    console.error("❌ REGISTRATION ERROR (non-email):");
    console.error("  Message:", error?.message);
    console.error("  Full error:", JSON.stringify(error, null, 2));

    // Clean up user if it was created before the error
    if (newUser) {
      try {
        await prisma.user.delete({ where: { id: newUser.id } });
      } catch (deleteError) {
        console.error("❌ Failed to clean up user after error:", deleteError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later."
    });
  }
};

// GET /api/auth/verify
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const cleanToken = (token as string)?.trim(); // Remove any hidden spaces

    if (!cleanToken) {
      return res.status(400).json({ success: false, message: "Token missing." });
    }

    console.log(`🔍 Attempting to verify token: ${cleanToken}`);

    // Use findUnique since it IS unique in your schema
    const user = await prisma.user.findUnique({
      where: { verificationToken: cleanToken }
    });

    if (!user) {
      console.error("❌ TOKEN NOT FOUND IN DB. Check if the user was deleted or token expired.");
      return res.status(400).json({ success: false, message: "Invalid token." });
    }

    // PERFORM THE UPDATE
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null // This prevents the link from being used twice
      },
    });

    console.log(`✅ SUCCESS: ${updatedUser.email} is now verified.`);

    return res.status(200).json({
      success: true,
      message: "Email verified! You can now log in."
    });

  } catch (error) {
    console.error("❌ DATABASE UPDATE ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error during verification." });
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('--- LOGIN DEBUG ---');
    console.log('Email:', email);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('❌ User not found in DB');
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch);
    console.log('Is Verified:', user.verified);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before logging in."
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_fallback_secret',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, error: "Login failed." });
  }
};

/**
 * PUT /api/auth/update-profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true, role: true }
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};