from number import Number

class Bet:

    amount: int
    color: str
    number: Number

    def __init__(self, amount:int, color: str = None, number: Number = None) -> None:
        self.amount = amount
        self.color = color
        self.number = number

    def get_amount(self) -> int:
        return self.amount

    def check(self, result: Number) -> int:
        if self.color is None and self.number.check_value(result):
            return self.amount * 36

        if self.number is None and result.check_color(self.color):
            return self.amount * 2

        return 0