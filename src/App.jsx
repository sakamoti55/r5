import { useEffect, useState } from "react";



export default function App() {
    const [data, setData] = useState(); //データを管理するステート(letより良い？っぽい)
    
    const [exchangedAmount,setExchangedAmount] = useState("");
    const [amount, setAmount] = useState("100");
    const [keepAcountry, setKeepAcountry] = useState("USD");
    const [keepBcountry, setKeepBcountry] = useState("JPY");
    const [Acountry, setAcountry] = useState("USD");
    const [Bcountry, setBcountry] = useState("JPY");
    //開いたとき、変更を加えたときに処理

    useEffect(() => {
      const fetchData = async () => {

        const url = await fetch("https://v6.exchangerate-api.com/v6/1c9d624b63ec437939cb13a5/latest/USD");
        const result = await url.json();
        setData(result);
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      handleClick();
    
    }, [data]);

    //A国での通貨をB国での通貨価値に換算する
    async function fetchCountry(data, keepAcountry, keepBcountry) {

      const Arate = data.conversion_rates[keepAcountry];
      const Brate = data.conversion_rates[keepBcountry];

      const ratio = parseFloat(Brate) / parseFloat(Arate);
      return ratio;
    }

    async function handleClick(event) {
      //多分ボタンを押すイベントが起きたときはpreventして、
      //押していないときはpreventしないようにしている？
      event && event.preventDefault();
  
      const newRatio = await fetchCountry(data, keepAcountry, keepBcountry);
      const roundedValue = parseFloat((amount * newRatio).toFixed(2));
      setExchangedAmount(roundedValue);
      setAcountry(keepAcountry);
      setBcountry(keepBcountry);
    }

    function changeCountry(event) {
      event.preventDefault();
      const keep = keepAcountry;
      setKeepAcountry(keepBcountry);
      setKeepBcountry(keep);
    }

  return (
    <>
      <header>
        <h1>Money Exchange</h1>
      </header>
      <div>
        <aside>
          <form className="form1">
            {/*label表示*/}
            <div className="div0">
              <label htmlFor="category">Choose a Country to Country</label> 
            </div>
            {/*国変更*/}
            <div className="div1">
              <select className="a"
                id="category" 
                //asyncは必要ない
                onChange={(event) => setKeepAcountry(event.target.value)}
                value={keepAcountry}//valueを用いて表示を変更する
              >
                {data && Object.keys(data.conversion_rates).map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                        {countryCode}
                    </option>
                ))}
              </select>

              <p>→</p>

              <select className="b"
                id="category2" 
                onChange={(event) => setKeepBcountry(event.target.value)}
                value={keepBcountry}//valueを用いて表示を変更する
              >
                {data && Object.keys(data.conversion_rates).map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                        {countryCode}
                    </option>
                ))}
              </select>
            </div>
            {/*国切り替えボタン*/}
            <div className="div2">
              {/*Enterキーでの誤実行を防ぐための処置 */}
              <form>
                <button onClick={changeCountry}>⇌</button>
              </form>
              
            </div>
            {/**/}
            <div className="div3">
              <label htmlFor="enterAmount">Enter amount:</label>
                <input 
                  type="text" 
                  id="enterAmount" 
                  placeholder="XXXX" 
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}         
                >
                </input>
                <button onClick={handleClick}>RUN</button>              
            </div>
          </form>
        </aside>
      </div>
      <div className="maindiv">
        <main>
          <div className="main1">
            <h2>
                - {Acountry} to {Bcountry}
            </h2>
            {/* &&は左辺評価→右辺評価　右辺が真なら右辺の結果を出力 */} 
            {exchangedAmount !== null && (
            <h3>
              Result: {exchangedAmount} {Bcountry}
            </h3>
            )}
          </div>
          <div className="main2">
            {/*下に主要な国の通貨への両替だけピックアップして書くかも*/}
            <h2>
              - Exchange rate
            </h2>
            {data && (
              <ul>              
                <li>1 USD: ${data.conversion_rates.USD}</li>

                <li>1  JPY : ${data.conversion_rates.JPY}</li>  

                <li>1 EUR: ${data.conversion_rates.EUR}</li>
              </ul> 
            )}
          </div>
        </main>
      </div>
      <footer>
        <div>日本大学文理学部情報科学科 Webプログラミングの演習課題</div>
        <div>5422021 望月晃星</div>
        
      </footer>
    </>
  );
}