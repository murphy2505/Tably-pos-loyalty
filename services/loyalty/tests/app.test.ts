import request from "supertest";
import app from "../src/index";

let customerId: string;

describe("LOYALTY API", () => {
  it("creates a customer", async () => {
    const res = await request(app)
      .post("/customers")
      .send({
        name: "Alice",
        phone: "0612345678",
        email: "alice@example.com",
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    // points mag 0 of undefined zijn, we normaliseren naar 0
    const points = res.body.points ?? 0;
    expect(points).toBe(0);

    customerId = res.body.id;
  });

  it("records a transaction and accrues points", async () => {
    const txRes = await request(app)
      .post("/transactions")
      .send({ customerId, amount: 42.75 });

    expect(txRes.status).toBe(201);
    expect(txRes.body.pointsEarned).toBeGreaterThan(0);

    const list = await request(app).get("/customers");
    const cust = list.body.find((c: any) => c.id === customerId);
    expect(cust).toBeDefined();

    const custPoints = cust.points ?? 0;
    expect(custPoints).toBe(txRes.body.pointsEarned);
  });

  it("redeems points", async () => {
    const listBefore = await request(app).get("/customers");
    const custBefore = listBefore.body.find((c: any) => c.id === customerId);
    expect(custBefore).toBeDefined();

    const currentPoints = custBefore.points ?? 0;
    const toRedeem = Math.floor(currentPoints / 2) || 1;

    const res = await request(app)
      .post("/rewards/redeem")
      .send({ customerId, points: toRedeem });

    expect(res.status).toBe(201);

    const listAfter = await request(app).get("/customers");
    const custAfter = listAfter.body.find((c: any) => c.id === customerId);
    expect(custAfter).toBeDefined();

    const afterPoints = custAfter.points ?? 0;
    expect(afterPoints).toBe(currentPoints - toRedeem);
  });
});
