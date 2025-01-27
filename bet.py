from number import Number

class Bet:

    amount: int
    type: str
    number: Number

    def __init__(self, amount:int, type: str, number: Number) -> None:
        self.amount = amount
        self.type = type
        self.number = number

    def get_amount(self) -> int:
        return self.amount

    def check(self, result: Number) -> int:
        if self.number.check_value(result):
            return self.amount * 36

        if self.type == "color" and self.number.check_color(result):
            return self.amount * 2

        return 0