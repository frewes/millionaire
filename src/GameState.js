

export default class GameState {
    constructor(filename) {
        this.FiftyFifty = true;
        this.PhoneAMentor = true;
        this.Audience = true;
    }

    load(tsv) {
        console.log("Not yet done");
        this.Questions = [];
        let lines = tsv.split('\n');
        if (lines.length !== 15) return false;
        lines.forEach (line => {
            try {
                let values = line.split('\t');
                let Q = {
                    value: parseInt(values[1]),
                    question: values[0],
                    correct: values[2],
                    answers: this.shuffle(values.slice(2))
                };
                this.Questions.push(Q);
            } catch (err) {
                console.log(err);
                return false;
            }
        });
        console.log(this.Questions);
        this.Questions.sort((a, b) => {
            return a.value - b.value;
        })
        return true;        
    }

    UseFiftyFifty() {
        this.FiftyFifty = false;
    }

    UsePhone() {
        this.PhoneAMentor = false;
    }

    UseAudience() {
        this.Audience = false;
    }

    shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
        }
      
        return a;
      }
    
}