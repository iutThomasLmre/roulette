from flask import Flask, render_template, request, url_for, redirect, jsonify, make_response
from roulette import Roulette
from number import Number

app = Flask(__name__)
game = Roulette()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new-game')
def new_game():
    game = Roulette()

    return jsonify({
        "balance": game.get_balance()
    }), 200

@app.route('/bet', methods=['POST'])
def bet():
    bet_data = request.json

    print(bet_data)

    if len(bet_data) > 0:
        for bet in bet_data:
            game.bet(bet["value"], bet["bet"])

        result_number: Number = game.play()
        start_balance: int = game.get_balance()
        game.check_bet(result_number)

        return jsonify({
            "balance": start_balance,
            "profit": game.get_balance() - start_balance,
            "bet": bet_data,
            "result": {
                "number": result_number.get_value(),
                "color": result_number.get_color()
            },
        }), 200
    
    return jsonify({
        "message": "Votre mise n'a pas été prise en compte"
    }), 400

if __name__ == '__main__':
    app.run(debug=True)