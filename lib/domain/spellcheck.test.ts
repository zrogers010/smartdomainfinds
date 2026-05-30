import { describe, expect, it } from "vitest";

import { correctText } from "@/lib/domain/spellcheck";

describe("correctText", () => {
  it("fixes vowel-confusion misspellings via consonant skeleton", () => {
    const { corrected, corrections } = correctText("miediavel castles");
    expect(corrected).toBe("medieval castles");
    expect(corrections).toContainEqual({ from: "miediavel", to: "medieval" });
  });

  it("fixes common 1-2 edit typos", () => {
    expect(correctText("recieve").corrected).toBe("receive");
    expect(correctText("definately").corrected).toBe("definitely");
    expect(correctText("restaraunt").corrected).toBe("restaurant");
  });

  it("preserves casing of the original token", () => {
    expect(correctText("Recieve").corrected).toBe("Receive");
  });

  it("leaves correctly-spelled text untouched", () => {
    const { corrected, corrections } = correctText(
      "app that helps freelancers track invoices"
    );
    expect(corrected).toBe("app that helps freelancers track invoices");
    expect(corrections).toHaveLength(0);
  });

  it("does not mangle short words or numbers", () => {
    const { corrections } = correctText("a 24/7 app hq");
    expect(corrections).toHaveLength(0);
  });
});
