from bet import Bet
from random import randint

class Roulette:

    balance: int = 100
    active_bet: Bet

    def __init__(self) -> None:
        pass

    def bet(self, amount:int, type: str, number: int) -> None:
        self.active_bet = Bet(amount, type, number)

    def play() -> None:
        pass