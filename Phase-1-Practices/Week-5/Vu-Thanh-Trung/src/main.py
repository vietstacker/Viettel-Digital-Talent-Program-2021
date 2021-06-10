class Rectangle:
    def __init__(self, long_edge, short_edge):
        self.long = long_edge
        self.short = short_edge

    def get_area(self):
        return self.long * self.short

    def get_perimeter(self):
        return (self.long + self.short) * 2


if __name__ == "__main__":
    print(Rectangle(1, 2).get_area())
    print(Rectangle(1, 2).get_perimeter())
