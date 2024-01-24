import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import './autocomplete.css'

type Product = {
  id: number,
  title: string
}

const Autocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedVal, setSelectedVal] = useState('');
  const [selectedValIndex, setSelectedValIndex] = useState<number>(-1);

  useEffect(() => {
    //fetching data from API
    const abortController = new AbortController();
    const fetchData = async() => {
      try {
        await fetch('https://fakestoreapi.com/products', { signal: abortController.signal })
          .then(res=>res.json())
          .then(data=>{
            setProducts(data)
            setFilteredSuggestions(data)
      })
      } catch(e) {
        if (!abortController.signal.aborted) {
          alert(`Error: ${e}`)
        }
      }
    }
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [])
  useEffect(() => {
    //debouncing on filter
    const timeoutId = setTimeout(() => {
      const filtered = products.filter((suggestion) =>
      suggestion.title.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    inputValue != '' && selectedVal == '' ? setShowSuggestions(true) : setShowSuggestions(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [products, inputValue, selectedVal])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
  };

  const handleInputBlur = () => {
    // hiding suggestions if clicked on outside anywhere
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (value: string) => {
    setInputValue(value)
    setSelectedVal(value);
    setShowSuggestions(false);
    setSelectedValIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "ArrowUp") {
      setSelectedValIndex(preIndex => (
        preIndex === -1 ? filteredSuggestions.length - 1 : preIndex -1
      ))
    } else if (e.key === "ArrowDown") {
      setSelectedValIndex(preIndex => (
        preIndex === filteredSuggestions.length - 1 ? -1 : preIndex +1
      ))
    }
    if (e.key === 'Enter' && filteredSuggestions.length > 0) {
      if (selectedValIndex !== -1) {
        handleSuggestionClick(filteredSuggestions[selectedValIndex].title);
      } else {
        // Select the first suggestion on Enter key press
        handleSuggestionClick(filteredSuggestions[0].title);
      }
    }
  };

  const matchTextStyle = (value: string) => {
    const regex = new RegExp(inputValue, "gi");
    return value.replace(regex, match => {
      return `<b>${match}</b>`;
    });
  };

  const clearTextField = () => {
    setInputValue('');
    setSelectedVal('');
  }

  return (
    <div style={{position: 'relative'}}>
      <input
        autoFocus
        type="text"
        className="autocomplete-input" 
        id="autocomplete-input"
        placeholder="Type products to search..."
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
      />
      {inputValue && <span className='clear-icon' onClick={clearTextField}>&#x2715;</span>}
      {showSuggestions && 
        <div className="autocomplete-dropdown" id="autocomplete-dropdown">
          {filteredSuggestions.length > 0 ? filteredSuggestions.map((suggestion, index) => (
            <div style={selectedValIndex === index ? {backgroundColor: '#f9f9f9'} : {backgroundColor: 'white'}} className={`autocomplete-item`} key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.title)}>
              <p dangerouslySetInnerHTML={{ __html: matchTextStyle(suggestion.title) }}></p>
            </div>
          )) : <div className='autocomplete-item'>Nothing to show!</div>}
        </div>
      }
    </div>
  );
};

export default Autocomplete;
