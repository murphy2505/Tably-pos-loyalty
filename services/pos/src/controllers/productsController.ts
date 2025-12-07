// ...existing imports...
function normalizeVariants(raw: any[]): { name: string; priceInclVat: number; vatRate: number; sortOrder?: number }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((v, idx) => {
    const name = String(v?.name ?? "").trim();
    const priceInclVat = Number(v?.priceInclVat);
    const vatRate = Number(v?.vatRate);
    const sortOrder = v?.sortOrder ?? idx;
    if (!name || Number.isNaN(priceInclVat) || Number.isNaN(vatRate)) {
      throw Object.assign(new Error("Invalid variant: name/priceInclVat/vatRate"), { status: 400 });
    }
    return { name, priceInclVat, vatRate, sortOrder };
  });
}

export async function createProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const variants = normalizeVariants(req.body?.variants ?? []);
    const created = await createProduct(req.tenantId!, {
      ...req.body,
      locationId: req.locationId ?? null,
      variants,
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function updateProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const hasVariants = Array.isArray(req.body?.variants);
    const variants = hasVariants ? normalizeVariants(req.body.variants) : undefined;
    const updated = await updateProduct(req.tenantId!, req.params.id, {
      ...req.body,
      variants,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
