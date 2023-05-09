import slugify from 'slugify'

export const getSlug = (title: string): string => {
  return `${slugify(title, { lower: true })}-${(
    (Math.random() * Math.pow(36, 6)) |
    0
  ).toString(36)}` // here we use Math class methods to generate a random integer and then toString to generate an unique string with it
}
