import { Router } from "express";
import { z } from "zod";
import {
  createCustomer as createCustomerSvc,
  listCustomers,
  getCustomerDetail,
} from "../services/customersService";

const router = Router();

// POST /customers (name + phone + optional email)
router.post("/", (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    phone: z.string().min(3),
    email: z.string().email().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  (async () => {
    try {
      const customer = await createCustomerSvc(
        parsed.data.name,
        parsed.data.phone,
        parsed.data.email
      );
      res.status(201).json(customer);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  })();
});

// GET /customers → lijst
router.get("/", (_req, res) => {
  (async () => {
    try {
      const list = await listCustomers();
      res.json(list);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  })();
});

// GET /customers/:id → detail
router.get("/:id", (req, res) => {
  (async () => {
    try {
      const detail = await getCustomerDetail(req.params.id);
      if (!detail) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(detail);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  })();
});

// GET /categories
router.get("/categories", async (req, res) => {
  try {
    // TODO: haal categories op gefilterd op tenantId
    res.json([]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /categories
router.post("/categories", async (req, res) => {
  try {
    // TODO: maak category aan
    res.status(201).json({ id: "cat-1" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /categories/:id
router.put("/categories/:id", async (req, res) => {
  try {
    // TODO: update category
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /categories/:id
router.delete("/categories/:id", async (req, res) => {
  try {
    // TODO: delete category
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;