import axios from "axios";
import { useState } from "react";

function App() {
    const [searchPrompt, setSearchPrompt] = useState("");
    const [art, setArt] = useState("large");
    const [cards, setCards] = useState([]);

    const handleOnChange = (e) => {
        setSearchPrompt(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const getCards = async () => {
            const response = await axios({
                url: "https://api.scryfall.com/cards/search",
                method: "GET",
                params: {
                    q: searchPrompt,
                },
            });
            setArt("large");
            setCards(response.data.data);
        };
        getCards();
    };

    const getAllArts = async (clickedCard) => {
        let whileContinue = true;
        let pageCount = 1;
        const cardsResponse = [];
        while (whileContinue) {
            const response = await axios({
                url: "https://api.scryfall.com/cards/search",
                method: "GET",
                params: {
                    q: `!"${clickedCard.name}"`,
                    unique: "art",
                    include_extras: true,
                    include_variations: true,
                    include_multilingual: true,
                    page: pageCount,
                },
            });
            cardsResponse.push(...response.data.data);
            if (response.data.total_cards - 175 * pageCount <= 0) break;
            pageCount++;
        }
        setCards(cardsResponse);
        setArt("art_crop");
    };

    const handleOnClick = (e, clickedCard) => {
        getAllArts(clickedCard);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="searchBar"
                    onChange={handleOnChange}
                    value={searchPrompt}
                />
            </form>
            <div id="cards">
                {cards.length > 0 &&
                    cards.map((card) =>
                        card.image_uris ? (
                            <img
                                src={card.image_uris.large}
                                alt={card.name}
                                onClick={(e) => handleOnClick(e, card)}
                                key={card.id}
                            />
                        ) : (
                            card.card_faces.map((face, index) => (
                                <img
                                    src={face.image_uris.large}
                                    onClick={(e) => handleOnClick(e, card)}
                                    key={card.id + index}
                                />
                            ))
                        )
                    )}
            </div>
        </>
    );
}

export default App;
