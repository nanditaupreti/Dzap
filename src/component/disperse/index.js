import React, {useState} from 'react'
import './index.css'

const Disperse = () => {
    const [lines, setLines] = useState([]);
    const [result, setResult] = useState([]);
    const [duplicatesEncountered, setDuplicatesEncountered] = useState(false);
    const uniqueAddresses = {};

    const handleInputChange = (event) => {
        const lineNumbers = document.querySelector('.line-numbers')
        const lines = event.target.value.split('\n')
        lineNumbers.innerHTML = Array(lines.length)
        .fill('<span></span>')
        .join('')
        setLines(lines)
    };

    const validateLine = (line, lineNumber) => {
        const parts = line.split(/, |=|""| /); // Split the line by ", ", "", "=", or space
        if (parts.length === 2 && !isNaN(Number(parts[1]))) {
          const address = parts[0].trim();
    
          if (uniqueAddresses[address]) {
            setDuplicatesEncountered(true);
            return `Address '${address}' encountered duplicate in Line: ${uniqueAddresses[address]}, ${lineNumber}`;
          } else {
            uniqueAddresses[address] = lineNumber;
            return;
          }
        } else {
          return `Line ${lineNumber} wrong amount`;
        }
      };

    const onSubmit = () => {
        const validationResults = lines.map((line, index) => validateLine(line, index + 1));
        setResult(validationResults);

    }

    const keepFirstOne = () => {
        const uniqueLines = [];
        const uniqueAddresses = {};
    
        for (const line of lines) {
          const address = line.split(/, |=|""| /)[0].trim();
          if (!uniqueAddresses[address]) {
            uniqueAddresses[address] = true;
            uniqueLines.push(line);
          }
        }
    
        setLines(uniqueLines);
    };
    
    const combineBalances = () => {
        const amountMap = {};
        for (const line of lines) {
          const parts = line.split(/, |=|""| /);
          const address = parts[0].trim();
          const amount = parseFloat(parts[1].trim());
    
          if (!isNaN(amount)) {
            if (amountMap[address]) {
              amountMap[address] += amount;
            } else {
              amountMap[address] = amount;
            }
          }
        }
    
        const summedLines = Object.keys(amountMap).map((address) => `${address}=${amountMap[address]}`);
        setLines(summedLines);
    };

    return (
        <div style={{margin: 'auto', width: '35%'}}>
            <p style={{textAlign: 'initial', color: 'grey'}} >Addresses with Amounts</p>
            <div className="editor" >
                <div className="line-numbers">
                    <span ></span>
                </div>
                <textarea value={lines.join('\n')} onChange={handleInputChange} >
                </textarea>
            </div>
            <p style={{textAlign: 'initial', color: 'grey'}}>Sepeated by ',' or '' or '='</p>
            <div>
                {duplicatesEncountered && <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <p style={{color: 'red'}}>Duplicated</p>
                    <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                        <div onClick={() => keepFirstOne()}>
                            <p style={{color: 'red', cursor: 'pointer'} }>Keep the first one</p>
                        </div>
                        <p style={{margin: '0 16px', color: 'red'}}>|</p>
                        <div onClick={() => combineBalances()}>
                            <p style={{color: 'red', cursor: 'pointer'}}>Combine Balace</p>
                        </div>
                    </div>
                </div>}
                {result.map((line, index) => (
                    line ? 
                    <div style={index != 1 ? {marginTop: '24px', border: '1px solid red', padding: '8px 16px', display: 'flex', alignItems: 'center', borderRadius: '2px', width: '100%'} : {marginTop: 0, border: '1px solid red', padding: '8px 16px', display: 'flex', alignItems: 'center', borderRadius: '2px', width: '100%'}} className='resultContainer'>
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            height="1em"
                            width="1em"
                            style={{color: 'red', marginRight: '50px', width: '16px', height: '16px', marginTop: '4px'}}
                            >
                            <path d="M11 7h2v7h-2zm0 8h2v2h-2z" />
                            <path d="M21.707 7.293l-5-5A.996.996 0 0016 2H8a.996.996 0 00-.707.293l-5 5A.996.996 0 002 8v8c0 .266.105.52.293.707l5 5A.996.996 0 008 22h8c.266 0 .52-.105.707-.293l5-5A.996.996 0 0022 16V8a.996.996 0 00-.293-.707zM20 15.586L15.586 20H8.414L4 15.586V8.414L8.414 4h7.172L20 8.414v7.172z" />
                        </svg>
                        <p style={{color: 'red', margin : 0}}>{line}</p>
                    </div>
                    : <></>
                ))}
            </div>
            <div>
                <button style={{ width: '85%', padding: '8px', backgroundColor: '#000080', color: 'white', borderRadius: '4px',cursor: 'pointer', marginTop: '16px'}} onClick={onSubmit}>Next</button>
            </div>  
        </div>
    )
}

export default Disperse