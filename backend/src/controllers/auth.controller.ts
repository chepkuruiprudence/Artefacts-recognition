import { Request, Response } from 'express';
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import emailService from '../services/email.service'; // Using your shared service
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * POST /api/auth/register
 * Register a new user and send verification email
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // 2. Generate verification token and hash password
    const token = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        verificationToken: token,
        role: 'USER', // Default role
        verified: false
      },
    });

    // 4. Send the verification email using your EmailConfig service
    await emailService.sendVerificationEmail(email, name, token);

    res.status(201).json({ 
      success: true, 
      message: "Registration successful! Please check your email to verify your account." 
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, error: "Registration failed. Please try again later." });
  }
};

/**
 * GET /api/auth/verify
 * Endpoint called when user clicks the link in their email
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).send("Verification token is missing.");

    // Find user with this token
    const user = await prisma.user.findUnique({ 
      where: { verificationToken: token as string } 
    });

    if (!user) return res.status(400).send("<h1>Invalid or expired token</h1>");

    // Update user status
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        verified: true, 
        verificationToken: null // Clear token after use
      },
    });

    // Success Response (You could also redirect to your frontend login page here)
    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #5a4a3a;">Email Verified Successfully!</h1>
        <p>Your account is now active. You can close this window and log in to the Ūgwati wa Gĩkũyũ archive.</p>
        <a href="http://localhost:5173/login" style="color: #c9a87c; font-weight: bold;">Go to Login</a>
      </div>
    `);
  } catch (error) {
    res.status(500).send("An error occurred during verification.");
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
    res.status(500).json({ success: false, error: "Login failed." });
  }
};

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
      select: { id: true, name: true, email: true, role: true } // Don't return the password
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