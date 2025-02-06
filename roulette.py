from bet import Bet
from number import Number
from random import randint

class Roulette:

    roulette: list[Number]
    balance: int = 100
    active_bets: list[Bet] = []

    def __init__(self) -> None:
        colors = ["G", "R", "B", "R", "B", "R", "B", "R", "B", "R", "B", "B", 
                  "R", "B", "R", "B", "R", "B", "R", "R", "B", "R", "B", "R", 
                  "B", "R", "B", "R", "B", "B", "R", "B", "R", "B", "R", "B", "R"]
        
        self.roulette = [Number(i, colors[i]) for i in range(37)]

    def get_balance(self) -> int:
        return self.balance
    
    def reset(self) -> None:
        self.balance = 100
        self.active_bets = []

    def bet(self, amount:int, bet:str) -> None:
        if amount > self.balance:
            return
        try:
            self.active_bets.append(Bet(amount, number=self.roulette[int(bet)]))
        except (ValueError, IndexError):
            self.active_bets.append(Bet(amount, color=bet[0]))

    def play(self) -> Number:
        if len(self.active_bets) == 0:
            return
        
        for bet in self.active_bets:
            self.balance -= bet.get_amount()

        index: int = randint(0, 36)
        number: Number = self.roulette[index]

        return number
    
    def check_bet(self, result) -> int:
        gain: int = 0
        for bet in self.active_bets:
            gain += bet.check(result)

        self.balance += gain
        self.active_bets = []

        return gain
    
    def martingale(self, amount: int, bet: str, objectif: int = None, iterations: int = None):
        amount_raised: int = amount

        if objectif is None:
            for i in range(iterations):
                self.bet(amount_raised, bet)
                number: Number = self.play()
                gain: int = self.check_bet(number)
                if gain == 0:
                    amount_raised *= 2
                else:
                    amount_raised = amount

    def main(self) -> None:
        play_number = str(input("Choisir un numéro entre 0 et 36 : "))
        bet_amout: int = int(input(f"Placer un pari (balance : {self.balance}) : "))

        self.bet(bet_amout, play_number)
        number: Number = self.play()

        print(f"Le numéro {number.get_value()} est tombé !")

        gain: int = self.check_bet(number)

        print(f"Vous avez gagné {gain}€ (balance {self.balance})")

# game = Roulette()
# end: bool = False
# while not end:
#     game.main()
#     if game.get_balance() <= 0:
#         end = True