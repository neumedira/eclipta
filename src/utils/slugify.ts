export const generateSlug = (title: string): string => {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // Hapus karakter non-alphanumeric
        .replace(/\s+/g, '-') // Ganti spasi dengan -
        .replace(/-+/g, '-'); // Ganti multiple - dengan single -

    const randomNumbers = Math.floor(10000 + Math.random() * 90000); // Generate 5 angka acak
    return `${slug}-${randomNumbers}`;
};