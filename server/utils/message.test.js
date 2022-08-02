let expect = require("expect");
var { generateMessage, generateLocationMessage } = require("./message");

describe("Generate Message", () => {
  it("should generate correct message object", () => {
    let from = "TAYO",
      text = "wagwan blood",
      message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({ from, text });
  });
});
describe("Generate Location Message", () => {
  it("should generate correct location object", () => {
    let from = "Tayo",
      lat = 6,
      lng = 3,
      url = `https://www.google.com/maps?q=${lat},${lng}`,
      message = generateLocationMessage(from, lat, lng);

    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({ from, url });
  });
});
