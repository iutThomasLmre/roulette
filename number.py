class Number:

    value: int
    color: str

    def __init__(self, value: int, color: str) -> None:
        self.value = value
        self.color = color

    def get_value(self) -> int:
        return self.value

    def get_color(self) -> str:
        return self.color

    def check_value(self, number) -> bool:
        return self.get_value() == number.get_value()

    def check_color(self, number) -> bool:
        return self.get_color() == number.get_color()