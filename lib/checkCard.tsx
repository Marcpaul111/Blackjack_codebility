const checkCard = (card: { face: string | number }, wants11: number) => {
  if (["jack", "queen", "king"].includes(card.face as string)) {
    return 10;
  }

  if (card.face === "ace") {
    return wants11 === 11 ? 11 : 1;
  }

  return Number(card.face);
};

export default checkCard;