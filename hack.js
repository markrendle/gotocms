var quux = function() {
	var foo;

	var bar = function() {
		foo = "Yes";
	}

	bar();
	console.log(foo);
}
quux();