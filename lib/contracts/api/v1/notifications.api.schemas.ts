import { z } from "zod";

export const adminInboxNotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  createdAtLabel: z.string(),
  read: z.boolean(),
  href: z.string().optional(),
});

export const adminInboxNotificationsResponseSchema = z.object({
  notifications: z.array(adminInboxNotificationSchema),
  unreadCount: z.number().int().nonnegative(),
});

export type AdminInboxNotificationApiDTO = z.infer<
  typeof adminInboxNotificationSchema
>;
export type AdminInboxNotificationsResponseDTO = z.infer<
  typeof adminInboxNotificationsResponseSchema
>;
