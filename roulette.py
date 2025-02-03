from bet import Bet
from number import Number
from random import randint

class Roulette:

    roulette: list[Number]
    balance: int = 100
    active_bet: Bet

    def __init__(self) -> None:
        colors = ["G", "R", "B", "R", "B", "R", "B", "R", "B", "R", "B", "B", 
                  "R", "B", "R", "B", "R", "B", "R", "R", "B", "R", "B", "R", 
                  "B", "R", "B", "R", "B", "B", "R", "B", "R", "B", "R", "B", "R"]
        
        self.roulette = [Number(i, colors[i]) for i in range(37)]

    def get_balance(self) -> int:
        return self.balance

    def bet(self, amount:int, bet:str) -> None:
        if amount > self.balance:
            return
        try:
            self.active_bet = Bet(amount, number=self.roulette[int(bet)])
        except (ValueError, IndexError):
            self.active_bet = Bet(amount, color=bet)        

    def play(self) -> Number:
        if self.active_bet is None:
            return
        
        self.balance -= self.active_bet.get_amount()

        index: int = randint(0, 36)
        number: Number = self.roulette[index]

        return number

    def main(self) -> None:
        play_number = str(input("Choisir un numéro entre 0 et 36 : "))
        bet_amout: int = int(input(f"Placer un pari (balance : {self.balance}) : "))

        game.bet(bet_amout, play_number)
        number: Number = game.play()

        print(f"Le numéro {number.get_value()} est tombé !")

        gain: int = self.active_bet.check(number)
        self.balance += gain

        print(f"Vous avez gagné {gain}€ (balance {self.balance})")

        self.active_bet = None

game = Roulette()
end: bool = False
while not end:
    game.main()
    if game.get_balance() <= 0:
        end = True