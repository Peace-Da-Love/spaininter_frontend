import { z } from 'zod';

export const createNewsCreateSchema = (t: (key: string) => string) =>
  z.object({
    category_name: z
      .string()
      .nonempty(t('validation.categoryRequired'))
      .refine(
        value => /^\d+$/.test(value) || /^[a-z0-9_]{2,50}$/.test(value),
        t('validation.categoryInvalid')
      ),
    city: z
      .string()
      .nonempty(t('validation.cityRequired'))
      .min(2, t('validation.cityMin'))
      .max(30, t('validation.cityMax')),
    province: z
      .string()
      .nonempty(t('validation.provinceRequired'))
      .min(2, t('validation.provinceMin'))
      .max(30, t('validation.provinceMax')),
    poster_link: z.string().min(1, t('validation.posterRequired')),
    title: z
      .string()
      .nonempty(t('validation.titleRequired'))
      .min(5, t('validation.titleMin'))
      .max(100, t('validation.titleMax')),
    description: z
      .string()
      .nonempty(t('validation.descriptionRequired'))
      .min(5, t('validation.descriptionMin'))
      .max(255, t('validation.descriptionMax')),
    content: z
      .string()
      .nonempty(t('validation.contentRequired'))
      .min(5, t('validation.contentMin'))
      .max(50000, t('validation.contentMax'))
  });
