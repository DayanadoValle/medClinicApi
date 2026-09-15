import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/rbacMiddleware';
import { UserRole } from '../entities/UserRole';

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get(
  '/ping',
  authMiddleware,
  authorize(UserRole.ADMIN),
  adminController.ping,
);

export { adminRoutes };
