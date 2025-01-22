class Bet:

    amount: int
    type: str
    number: int

    def __init__(self, amount:int, type: str, number: int) -> None:
        self.amount = amount
        self.type = type
        self.number = number