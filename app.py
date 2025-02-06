from flask import Flask, render_template, request, url_for, redirect, jsonify, make_response
from roulette import Roulette
from number import Number

app = Flask(__name__)
game = Roulette()

@app.route('/')
def index():
    game.reset()
    return render_template('index.html', balance=game.get_balance())

@app.route('/get_balance', methods=['GET'])
def get_balance():
    return jsonify({"balance": game.get_balance()})

@app.route('/new', methods=['GET'])
def new_game():
    game.reset()
    return jsonify({ "message": "Nouvelle roulette créée", "balance": game.get_balance() })

@app.route('/martingale', methods=['POST'])
def martingale():
    bet_data = request.json

    balance_history = []

    bet = bet_data["bet"]["bet"]
    bet_value = int(bet_data["bet"]["value"])
    iterations = int(bet_data["iterations"])
    objectif = int(bet_data["objectif"])

    if iterations == 0 or iterations is None:
        balance_history = game.martingale(bet_value, bet, objectif=objectif)
    else:
        balance_history = game.martingale(bet_value, bet, iterations=iterations)

    return jsonify({ "message": "Martingale réalisée", "balance_history": balance_history })

@app.route('/hardi', methods=['POST'])
def hardi():
    bet_data = request.json

    bet = bet_data["bet"]["bet"]
    objectif = int(bet_data["objectif"])

    balance_history = game.hardi(bet, objectif)

    return jsonify({ "message": "Hardi réalisée", "balance_history": balance_history })


@app.route('/bet', methods=['POST'])
def bet():
    bet_data = request.json

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