import { z } from "zod";

export const stationIdSchema = z.string().regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/);

const letterSchema = z
  .object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    paragraphs: z.array(z.string().min(80)).min(2).max(4),
    signature: z.string().min(1),
  })
  .strict();

const narrativeSectionSchema = z
  .object({
    title: z.string().min(1),
    body: z.string().min(80),
    prompt: z.string().min(1),
  })
  .strict();

export const stationSchema = z
  .object({
    id: stationIdSchema,
    order: z.number().int().positive(),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    description: z.string().min(1),
    poeticMessage: z.string().min(1),
    letters: z.array(letterSchema).min(2).max(3),
    sections: z.array(narrativeSectionSchema).min(2).max(4),
    reflection: z.string().min(1),
    actionLabel: z.string().min(1),
    completionMessage: z.string().min(1),
    landmark: z.string().min(1),
    flowerName: z.string().min(1),
    flowerMeaning: z.string().min(1),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    position: z.tuple([z.number(), z.number(), z.number()]),
    triggerDistanceMeters: z.number().positive(),
  })
  .strict();

export const stationsFileSchema = z.array(stationSchema).length(8);

export type StationRecord = z.infer<typeof stationSchema>;
