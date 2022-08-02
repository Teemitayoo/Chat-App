const expect = require("expect");
const { realString } = require("./realstring");

describe("is Real String", () => {
  it("should reject non-string values", () => {
    let res = realString(65);
    expect(res).toBe(false);
  });
  it("should reject string containing only spaces", () => {
    let res = realString("              ");
    expect(res).toBe(false);
  });
  it("should allow string with non-space chars", () => {
    let res = realString("   Tayo      ");
    expect(res).toBe(true);
  });
});
