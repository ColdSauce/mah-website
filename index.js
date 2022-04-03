import { h, Component, render } from "https://unpkg.com/preact?module";
import htm from "https://unpkg.com/htm?module";
import textToShow from "./text.js";
import { changeHue } from "./colorUtils.js";

const html = htm.bind(h);

function logWeirdStuff() {
  var totalAmount = 0;
  var message = "%cI Re Call Seeing Darkness";
  const timer = setInterval(() => {
    console.log(
      message,
      "background:" +
        changeHue("#9b59b6", 3 * totalAmount) +
        "; color: #ecf0f1; padding: 20px; font-size:1.3em"
    );
    if (totalAmount > 4000) {
      message = "%csailor's lucky number is seven";
    } else if (totalAmount > 2000) {
      message = "%cfollow me to the number of the beast";
    } else if (totalAmount > 0) {
      message = "%cI Re Call Seeing Darkness";
    }

    totalAmount = (totalAmount + 1) % 10000;
  }, 0);
}
logWeirdStuff();

class TextChunk extends Component {
  fillText(props) {
    var toReturn = "";
    for (var i = 0; i < props.text.length; i++) {
      toReturn += " ";
    }
    return toReturn;
  }

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  generateIndexes(props) {
    return this.shuffle(Array.from(Array(this.props.text.length).keys()));
  }

  constructor(props) {
    super(props);
    this.timerCreated = false;
    this.fillText = this.fillText.bind(this);
    this.createTimer = this.createTimer.bind(this);
    this.generateIndexes = this.generateIndexes.bind(this);
    this.isLink = props.text.startsWith("LINK");

    this.state = {
      textWritten: this.props.type == "writer" ? "" : this.fillText(props),
      indexes: this.generateIndexes(props),
      currentIndex: 0,
      hasFinished: false,
    };

    if (this.props.shouldWrite || this.props.type !== "writer") {
      this.createTimer();
    }
  }

  componentDidUpdate(props) {
    if (
      this.props.type == "writer" &&
      this.props.shouldWrite &&
      !this.timerCreated
    ) {
      this.createTimer();
    }
  }

  shouldComponentUpdate(nextProps, _) {
    if (nextProps.type == "writer") {
      return nextProps.shouldWrite;
    } else if ((nextProps.type = "fizzle")) {
      return true;
    }
  }

  createTimer() {
    if (this.isLink) {
      this.props.text = this.props.text.slice(5);
    }
    let context = this;
    const timer = setInterval(
      () => {
        context.timerCreated = true;
        if (this.props.type == "writer") {
          if (this.state.textWritten == this.props.text) {
            clearInterval(timer);
            this.props.onFinished(this.props.index);
            return;
          }
          const newChar = this.props.text[this.state.textWritten.length];
          this.setState({
            ...this.state,
            textWritten: this.state.textWritten + newChar,
          });
        } else if (this.props.type == "fizzle") {
          if (this.state.currentIndex == this.state.indexes.length) {
            clearInterval(timer);
            this.props.onFinished();
            this.setState({
              ...this.state,
              hasFinished: true,
            });
            return;
          }
          const newIndex = this.state.indexes[this.state.currentIndex];
          const newChar = this.props.text[newIndex];
          this.setState({
            ...this.state,
            textWritten:
              this.state.textWritten.slice(0, newIndex) +
              newChar +
              this.state.textWritten.slice(newIndex + 1),
            currentIndex: this.state.currentIndex + 1,
          });
        }
      },
      this.props.type === "writer" ? 0 : 20
    );
  }

  render() {
    if (this.state.hasFinished) {
      if (this.isLink) {
        return html`<pre style="${this.props.style}"> <a href="${this.props
          .text}">${this.props.text}</a> </pre>`;
      } else {
        return html`<pre style="${this.props.style}">${this.props.text}</pre>`;
      }
    } else {
      if (this.isLink) {
        return html`<pre style="${this.props.style}"> <a href="${this.props
          .text}">${this.state.textWritten}</a> </pre>`;
      } else {
        return html`<pre style="${this.props.style}">
 ${this.state.textWritten} </pre
        >`;
      }
    }
  }
}

class FizzleText extends Component {
  constructor(props) {
    super();
    this.INITIAL_GREEN = "#27ae60";
    this.createColorMapping = this.createColorMapping.bind(this);
    this.onFinished = this.onFinished.bind(this);
    this.createColorMapping(props);
    this.totalFinished = 0;
  }

  onFinished() {
    this.totalFinished++;
    if (this.totalFinished == this.props.textList.length) {
      this.props.onFinished();
    }
  }

  createColorMapping(props) {
    this.colorMapping = props.textList.map((_, index) =>
      changeHue(this.INITIAL_GREEN, index * 2.3)
    );
  }

  render() {
    return html` ${this.props.textList.map(
      (text, index) => html`
        <${TextChunk}
          onFinished=${this.onFinished}
          text=${text}
          type="fizzle"
          style="color:${this.colorMapping[index]}"
        />
      `
    )}`;
  }
}

class WriterText extends Component {
  constructor(props) {
    super();
    this.INITIAL_GREEN = "#2ecc71";
    this.createColorMapping = this.createColorMapping.bind(this);
    this.onFinished = this.onFinished.bind(this);
    this.createColorMapping(props);
    this.state = {
      writeOnOffMapping: Array(props.textList.length).fill(false),
    };
    this.state.writeOnOffMapping[0] = true;
  }
  onFinished(index) {
    let newWriteOnOffMapping = Object.assign([], this.state.writeOnOffMapping, {
      [index]: false,
    });
    if (index < this.state.writeOnOffMapping.length - 1) {
      newWriteOnOffMapping = Object.assign([], newWriteOnOffMapping, {
        [index + 1]: true,
      });
    }
    this.setState({
      ...this.state,
      writeOnOffMapping: newWriteOnOffMapping,
    });
  }
  createColorMapping(props) {
    this.colorMapping = props.textList.map((_, index) =>
      changeHue(this.INITIAL_GREEN, index * 2.3)
    );
  }

  render() {
    return html` ${this.props.textList.map(
      (text, index) => html`
        <${TextChunk}
          shouldWrite=${this.state.writeOnOffMapping[index]}
          onFinished=${this.onFinished}
          index=${index}
          text=${text}
          type="writer"
          style="color:${this.colorMapping[index]}"
        />
      `
    )}`;
  }
}

class Life extends Component {
  constructor() {
    super();
    this.biasRandom = this.biasRandom.bind(this);
    this.createTimer = this.createTimer.bind(this);
    this.onFinished = this.onFinished.bind(this);
    this.mod = this.mod.bind(this);
    this.state = {
      board: new Array(30)
        .fill(null)
        .map(() =>
          new Array(80)
            .fill(null)
            .map(() => Math.floor(this.biasRandom(0, 2, 2.9)))
        ),
    };

    this.getStringRepr = this.getStringRepr.bind(this);
  }

  onFinished() {
    setTimeout(() => this.createTimer(), 400);
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  createTimer() {
    setInterval(() => {
      let newBoard = this.state.board;
      let hasChanged = false;
      for (var i = 0; i < newBoard.length; i++) {
        for (var j = 0; j < newBoard[i].length; j++) {
          let numNeighbors =
            newBoard[this.mod(i + 1, newBoard.length)][j] + //right
            newBoard[this.mod(i + 1, newBoard.length)][
              this.mod(j + 1, newBoard[i].length)
            ] + // bottom right
            newBoard[i][this.mod(j + 1, newBoard[i].length)] + // bottom
            newBoard[this.mod(i - 1, newBoard.length)][
              this.mod(j + 1, newBoard[i].length)
            ] + // bottom left
            newBoard[this.mod(i - 1, newBoard.length)][j] + // left
            newBoard[this.mod(i - 1, newBoard.length)][
              this.mod(j - 1, newBoard[i].length)
            ] + // left-up
            newBoard[i][this.mod(j - 1, newBoard[i].length)]; // up
          newBoard[this.mod(i + 1, newBoard.length)][
            this.mod(j - 1, newBoard[i].length)
          ]; // right up
          if (newBoard[i][j] == 1) {
            // alive
            if (numNeighbors != 2 && numNeighbors != 3) {
              hasChanged = true;
              newBoard[i][j] = 0;
            }
          } else {
            if (numNeighbors == 3) {
              hasChanged = true;
              newBoard[i][j] = 1;
            }
          }
        }
      }
      if (!hasChanged) {
        this.setState({
          ...this.state,
          board: new Array(30)
            .fill(null)
            .map(() =>
              new Array(80)
                .fill(null)
                .map(() => Math.floor(this.biasRandom(0, 2, 2.9)))
            ),
        });
      } else {
        this.setState({
          ...this.state,
          board: newBoard,
        });
      }
    }, 200);
  }

  biasRandom(low, high, bias) {
    var r = Math.random();
    r = Math.pow(r, bias);
    return low + (high - low) * r;
  }

  getStringRepr() {
    let stringLines = [];
    let stringRepr = "";
    for (var i = 0; i < this.state.board.length; i++) {
      for (var j = 0; j < this.state.board[i].length; j++) {
        stringRepr += this.state.board[i][j] == 0 ? "." : "#";
      }
      stringLines.push(stringRepr);
      stringRepr = "";
    }
    return stringLines;
  }

  render() {
    return html`<${FizzleText}
      onFinished=${this.onFinished}
      textList=${this.getStringRepr()}
    />`;
  }
}
class App extends Component {
  render() {
    return html`<div>
      <${WriterText} textList=${textToShow} />
      <div class="life"><${Life} /></div>
    </div>`;
  }
}

render(html`<${App} />`, document.body);
