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

    // 4. Send the verification email
    await emailService.sendVerificationEmail(email, name, token);

    res.status(201).json({ 
      success: true, 
      message: "Registration successful! Please check your email to verify your account." 
    });
  } catch (error) {
    // IF EMAIL FAILS: Delete the user so they aren't stuck with a taken email but no verification
    if (newUser) {
      await prisma.user.delete({ where: { id: newUser.id } });
    }
    
    console.error("Registration Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Could not send verification email. Please try again later." 
    });
  }
};

//GET /api/auth/verify
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: "Verification token is missing." });
    }

    // Find user with this token
    const user = await prisma.user.findUnique({ 
      where: { verificationToken: token as string } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }

    // Update user status
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        verified: true, 
        verificationToken: null 
      },
    });

    return res.status(200).json({ 
      success: true, 
      message: "Email verified successfully!" 
    });

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ 
        success: false, 
        message: "An error occurred during verification." 
    });
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

    // Check if verified
    if (!user.verified) {
      return res.status(403).json({ 
        success: false, 
        message: "Please verify your email address before logging in." 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'your_fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({ 
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
    res.status(500).json({ success: false, error: "Login failed." });
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

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};