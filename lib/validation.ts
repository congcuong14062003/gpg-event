import { z } from 'zod';

const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên quá dài'),
  phone: z
    .string()
    .min(1, 'Số điện thoại là bắt buộc')
    .regex(vietnamPhoneRegex, 'Số điện thoại không hợp lệ'),
  email: z
    .string()
    .email('Email không đúng định dạng')
    .optional()
    .or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  note: z.string().max(1000).optional().or(z.literal('')),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int('Số lượng phải là số nguyên').positive('Số lượng phải lớn hơn 0'),
});

export const registerSchema = z.object({
  customer: customerSchema,
  items: z
    .array(cartItemSchema)
    .min(1, 'Giỏ hàng không được trống'),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
