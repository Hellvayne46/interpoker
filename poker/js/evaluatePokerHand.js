
/**
 * @typedef {Object} Card
 * @property {string} suit - Suit of the card - Either "club", "spade", "diamond" or "heart"
 * @property {number} rank - Number rank of the card - So 1 for Ace, 2 for Two, 3 for Three, and so on, until 10 for Ten, then 11 for Jack, 12 for Queen and 13 for King
 */

/**
 * Given a poker hand of 5 cards, examines the cards and returns a string describing the type of win.
 *
 * @param {Array.<Card>} hand - Array of the card objects that make up the poker hand.
 * @returns {string} - Returns a string for the type of the win detected:
 *		"highcard" - Five cards which do not form any of the combinations below
 *		"pair" - A hand with two cards of equal rank and three cards which are different from these and from each other
 *		"twopair" - A hand with two pairs of different ranks
 *		"threeofakind" - Three cards of the same rank plus two unequal cards
 *		"straight" - Five cards of mixed suits in sequence
 *		"flush" - Five cards of the same suit
 *		"fullhouse" - Three cards of one rank and two cards of another rank
 *		"fourofakind" - Four cards of the same rank and the fifth card can be anything
 *		"straightflush" - Five cards of the same suit in sequence
 *		"royalflush" - A 10, Jack, Queen, King and Ace ranked cards of the same suit
 */
function evaluatePokerHand(hand) {
	//Extranct the data from the hand array, { rank and suit}
	const ranks = hand.map(card => card.rank);
	const suits = hand.map(card => card.suit.toLowerCase());

	const rankCounts = new Map();
	//sets the ranks and reorders in the new map
	for (const rank of ranks) {
		rankCounts.set(rank, (
			//if rank is undefined set as 0
			rankCounts.get(rank) || 0) + 1
		);
	}

	// Sort counts descending for easy pattern matching
	const descendingOrder = [...rankCounts.values()].sort((a, b) => b - a);
	//Check for pairs, if value is equal to 2
	const numPairs = [...rankCounts.values()].filter(value => value === 2).length;
	//From sorted array, if 0 is 3, we might have 3 of a kind or a full house
	const hasThree = descendingOrder[0] === 3;
	//If 0 is 4 we have 4 of a kind
	const hasFour = descendingOrder[0] === 4;
	// For each suit in suits, we check is this suit the same as the first card's suit?
	const isFlush = suits.every(suit => suit === suits[0]);

	//If the rank is 1 (Ace), change it to 14 to check high straights.
	//Then sort in ascending order
	const ranksAceHigh = ranks.map(
		rank => (rank === 1 ? 14 : rank)
	).sort((a, b) => a - b);

	//Make a new array with duplicates removed
	const uniqueAceHigh = [...new Set(ranksAceHigh)];

	function isConsecutive(sortedRanks) {
		// Must have exactly 5 cards
		if (sortedRanks.length !== 5) {
			return false;
		}
		// Check that each number is 1 greater than the previous one
		for (let i = 1; i < sortedRanks.length; i++) {
			if (sortedRanks[i] - sortedRanks[i - 1] !== 1) {
				return false; //not consecutive
			}
		}
		return true; // all cards are in order
	}

	// Check for pattern  A, 2, 3, 4, 5
	let sortedCards = ranks.slice().sort((a, b) => a - b); // copy and sort the ranks
	let wheelPattern = [1, 2, 3, 4, 5]; // the exact sequence for low straight

	let wheelStraight = true;
	for (let i = 0; i < sortedCards.length; i++) {
		if (sortedCards[i] !== wheelPattern[i]) {
			//check pattern, return false is mismatched
			wheelStraight = false;
			break;
		}
	}

	//checks that the length if the array is equal to 5 (a hand) and that they go up in incrments of 1
	//or a wheel straight
	const isStraight = (uniqueAceHigh.length === 5 && isConsecutive(uniqueAceHigh)) || wheelStraight;

	// If it is the wheel straight, the highest card is 5.
	// If not last element ([4] in a 5-card hand) is the highest card.
	const straightHigh = wheelStraight ? 5 : ranksAceHigh[4];

	//
	if (isStraight && isFlush) {
		//highest card is an Ace(14) so the lowest card is 10.
		if (straightHigh === 14 && ranksAceHigh[0] === 10){
			return "royalflush";
		} else{
			return "straightflush";
		}
	}

	//Return for each check
	if (hasFour) return "fourofakind";
	if (hasThree && numPairs === 1) return "fullhouse";
	if (isFlush) return "flush";
	if (isStraight) return "straight";
	if (hasThree) return "threeofakind";
	if (numPairs === 2) return "twopair";
	if (numPairs === 1) return "pair";

	return "highcard";
}

module.exports = evaluatePokerHand;
