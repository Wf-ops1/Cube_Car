import { z } from 'zod';

export const CarCategorySchema = z.enum(['Hatch', 'Sedan', 'SUV', 'Elétrico', 'Luxo']);


export const OwnerDetailsSchema = z.object({
    name: z.string(),
    avatar: z.string(),
    isSuperhost: z.boolean().optional(),
    yearsHosting: z.number().optional(),
    job: z.string().optional(),
    quote: z.string().optional(),
    bio: z.string().optional(),
    school: z.string().optional(),
});

// A única fonte da verdade (SSOT) para o modelo de Carro no sistema.
export const CarSchema = z.object({
    id: z.string(),
    make: z.string().min(2, 'Marca deve ter pelo menos 2 caracteres'),
    model: z.string().min(1, 'Modelo é obrigatório'),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    type: CarCategorySchema,
    category: CarCategorySchema.optional(), // Aliased to type
    pricePerDay: z.number().min(1, 'Preço deve ser maior que zero'),
    location: z.string().min(3, 'Localização deve ser mais específica'),
    imageUrl: z.string(),
    images: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    rating: z.number().optional(),
    trips: z.number().optional(),
    ownerId: z.string(), // Obrigatório! Todo carro precisa de dono no BD.
    ownerDetails: OwnerDetailsSchema.optional(),
    description: z.string().optional(),
    neighborhood: z.string().optional(),
    availabilityHours: z.object({
        start: z.string(),
        end: z.string(),
    }).optional(),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
    isActiveAd: z.boolean().optional(),
    isOptimistic: z.boolean().optional(), // Flag de estado UI para Merge Guarding
    rejectionReason: z.string().optional(),
});

// A MÁGICA SÊNIOR: o TS deriva o tipo a partir do Schema Zod
export type Car = z.infer<typeof CarSchema>;
export type CarFormData = z.infer<typeof CarSchema>;
