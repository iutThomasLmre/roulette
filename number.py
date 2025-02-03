class Number:

    value: str
    color: str

    def __init__(self, value: str, color: str) -> None:
        self.value = value
        self.color = color

    def get_value(self) -> str:
        return self.value

    def get_color(self) -> str:
        return self.color

    def check_value(self, number) -> bool:
        return self.get_value() == number.get_value()

    def check_color(self, color: str) -> bool:
        return self.get_color() == color