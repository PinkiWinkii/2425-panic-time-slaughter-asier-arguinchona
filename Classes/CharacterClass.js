class Character {
  constructor(data) {
    this.name = data.name;
    this.occupation = data.occupation;
    this.description = data.description;
    this.stats = {
      strength: data.stats.strength,
      dexterity: data.stats.dexterity,
      stamina: data.stats.stamina,
    };
    this.equipment = {
      saddlebag: data.equipment.saddlebag,
      quiver: data.equipment.quiver,
      weapons: data.equipment.weapons,
      pouch: {
        coins: data.equipment.pouch.coins,
        gold: data.equipment.pouch.gold,
        precious_stones: data.equipment.pouch.precious_stones,
      },
      miscellaneous: data.equipment.miscellaneous,
    };
  }

  // Add methods as needed
}

export default Character;