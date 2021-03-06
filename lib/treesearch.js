/*
fringe - struktura danych (np stos, kolejka) przechowująca wierzchołki do odwiedzenia
initial_state  - ~
successor - funkcja następnika
goaltest - funkcja, która dla danego stanu zwraca true, jeżeli stan jest stanem spełniającym cel, false w przeciwnym razie
f - funkcja kosztu
*/

function Node(state, depth){
	this.state = state;
	this.depth = depth===undefined?0:depth;
	this.action = null;
	this.parent = null;
}

function construct_response(node){
	var ret = [node.action];
	var current_node = node;
	while(current_node.parent){
		current_node = current_node.parent;
		if(current_node.action) ret.unshift(current_node.action);
	}
	ret = ret.reverse();
	return ret;
}

function Treesearch(fringe_class, initial_state, successor, goaltest, f, state_hasher, max_depth, max_visited_states){

	max_depth = max_depth===undefined? Infinity : max_depth;

	var fringe = new fringe_class();

	var visited_states = {};
	var amount_of_visited_states = 0;
	var max_encountered_depth = -Infinity;

	var best_estimate = Infinity;

	fringe.put(new Node(initial_state, 0));
	var ret = false;

	console.log("thinking...");
	while(!fringe.empty()){
		//console.time("iteration");
		var elem = fringe.pop();
		if(goaltest(elem.state)){
			ret = construct_response(elem);
			break;
		}
		amount_of_visited_states++;
		if(amount_of_visited_states>max_visited_states){
			break;
		}
		var next_nodes = successor(elem.state);
		if(elem.depth>=max_encountered_depth) max_encountered_depth = elem.depth;
		if(elem.depth<max_depth){
			for(var i in next_nodes){
				var state_hash = state_hasher(next_nodes[i].state);
				if(!visited_states[state_hash]){
					var new_node = new Node(next_nodes[i].state, elem.depth+1);
					new_node.parent = elem;
					new_node.action = next_nodes[i].action;
					var estimate = f(new_node.state, new_node.action);
					if(estimate<best_estimate) best_estimate = estimate;
					fringe.put(new_node, estimate + elem.depth);
					visited_states[state_hash] = true;
				}
			}
		}
		//console.timeEnd("iteration");
	}
	console.log("max encountered depth:".yellow, max_encountered_depth);
	console.log("amount of visited states:".yellow, amount_of_visited_states);
	console.log("max allowed depth:".yellow, max_depth);
	console.log("solution length:".yellow, ret.length);
	return ret;
}	

module.exports = Treesearch;