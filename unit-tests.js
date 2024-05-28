describe("getNextLottoDraw", function () {
  it("should return the next Wednesday if today is Monday", function () {
    const monday = new Date("2023-05-22T12:00:00"); // Monday
    const expected = new Date("2023-05-24T20:00:00"); // Next Wednesday at 8 PM
    expect(getNextLottoDraw(monday)).toEqual(expected);
  });

  it("should return the next Saturday if today is Wednesday after 8 PM", function () {
    const wednesday = new Date("2023-05-24T21:00:00"); // Wednesday after 8 PM
    const expected = new Date("2023-05-27T20:00:00"); // Next Saturday at 8 PM
    expect(getNextLottoDraw(wednesday)).toEqual(expected);
  });

  it("should return today if today is Saturday before 8 PM", function () {
    const saturday = new Date("2023-05-27T19:00:00"); // Saturday before 8 PM
    const expected = new Date("2023-05-27T20:00:00"); // Today at 8 PM
    expect(getNextLottoDraw(saturday)).toEqual(expected);
  });

  it("should return the next Wednesday if today is Sunday", function () {
    const sunday = new Date("2023-05-21T12:00:00"); // Sunday
    const expected = new Date("2023-05-24T20:00:00"); // Next Wednesday at 8 PM
    expect(getNextLottoDraw(sunday)).toEqual(expected);
  });

});

