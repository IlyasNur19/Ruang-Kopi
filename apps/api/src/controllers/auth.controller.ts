import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';

export const authController = {

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.email, email));

            if (!user) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            const token = generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    getMe: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            const [user] = await db
                .select({
                    id: users.id,
                    email: users.email,
                    name: users.name,
                    role: users.role,
                    createdAt: users.createdAt,
                })
                .from(users)
                .where(eq(users.id, req.user.userId));

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json(user);
        } catch (error) {
            next(error);
        }
    },
};
