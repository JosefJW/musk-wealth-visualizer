from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_wealth_data')
def get_wealth_data():
    # Example data endpoint (optional)
    musk_wealth = 429200000000  # Elon Musk's wealth
    unit_salary = 3400000         # Average yearly salary
    return jsonify({
        'total_wealth': musk_wealth,
        'unit_salary': unit_salary
    })

if __name__ == '__main__':
    app.run(debug=True)
