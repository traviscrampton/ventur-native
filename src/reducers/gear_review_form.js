const defaultGearForm = {
  gearItemId: null,
  name: "Ortlieb top roller",
  images: [],
  rating: 4,
  pros: [
    { id: 1, text: "waterproof beyond belief", isPro: true },
    { id: 2, text: "very durable, and sealed", isPro: true },
    { id: 3, text: "nice material", isPro: true }
  ],
  cons: [{ id: 4, text: "dirty clothes stick up whole bag" }],
  review:
    "What is there to say about these bags that hasn't said before? I think this is one of the greatest inventions that cycle touring has ever had and I am confident in that fact. I mean take a think about it, isn't it amazing and isn't this a really long text that I am writing, i mean come on thats ridiculous!"
}

export default (state = defaultGearForm, action) => {
  switch (action.type) {
    default:
      return state
  }
}
