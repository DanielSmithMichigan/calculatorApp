QUnit.test("expressionEvaluatorTest", function(assert) {
	
});
QUnit.test("screenWriterTest", function( assert ) {
	var screen = new screenWriter();
	assert.deepEqual(screen.symbolStack, [], "test_001");
	screen.addToStack('5');
	assert.deepEqual(screen.symbolStack, ['5'], "test_002");
	screen.addToStack('4');
	assert.deepEqual(screen.symbolStack, ['54'], "test_003");
	screen.addToStack('3');
	assert.deepEqual(screen.symbolStack, ['543'], "test_004");
	screen.addToStack('.');
	assert.deepEqual(screen.symbolStack, ['543.'], "test_005");
	screen.addToStack('.');
	assert.deepEqual(screen.symbolStack, ['543.'], "test_006");
	screen.addToStack('0');
	assert.deepEqual(screen.symbolStack, ['543.0'], "test_007");
	screen.addToStack('0');
	assert.deepEqual(screen.symbolStack, ['543.00'], "test_008");
	screen.addToStack('1');
	assert.deepEqual(screen.symbolStack, ['543.001'], "test_009");
	screen.emptyStack();
	assert.deepEqual(screen.symbolStack, [], "test_010");
	screen.addToStack('12');
	assert.deepEqual(screen.symbolStack, ['12'], "test_011");
	screen.addToStack('.12');
	assert.deepEqual(screen.symbolStack, ['12.12'], "test_012");
	screen.emptyStack();
	screen.addToStack('12.');
	assert.deepEqual(screen.symbolStack, ['12.'], "test_013");
	screen.addToStack('12');
	assert.deepEqual(screen.symbolStack, ['12.12'], "test_014");
	screen.emptyStack();
	screen.addToStack('1');
	screen.addToStack('+');
	var stackCompare = ['1', '+'];
	assert.deepEqual(screen.symbolStack, stackCompare, "test_015");
	screen.addToStack('+');
	stackCompare = ['1', '+'];
	assert.deepEqual(screen.symbolStack, stackCompare, "test_016");
	screen.addToStack('-');
	stackCompare = ['1', '-'];
	assert.deepEqual(screen.symbolStack, stackCompare, "test_017");
	screen.addToStack('.');
	stackCompare = ['1', '-', '0.'];
	assert.deepEqual(screen.symbolStack, stackCompare, "test_018");
	screen.addToStack('1');
	stackCompare = ['1', '-', '0.1'];
	assert.deepEqual(screen.symbolStack, stackCompare, "test_019");
	screen.addToStack('.');
	stackCompare = ['1', '-', '0.1'];
	assert.deepEqual(screen.symbolStack, stackCompare, "test_020");
	screen.addToStack('/');
	stackCompare = ['1', '-', '0.1', '/'];
	assert.deepEqual(screen.symbolStack, stackCompare, "test_021");
	screen.addToStack('.');
	stackCompare = ['1', '-', '0.1', '/', '0.'];
	assert.deepEqual(screen.symbolStack, stackCompare, "test_022");
	screen.emptyStack();
	screen.addToStack('0');
	assert.deepEqual(screen.symbolStack, ['0'], "test_023");
	screen.addToStack('1');
	assert.deepEqual(screen.symbolStack, ['1'], "test_024");
	screen.addToStack('0');
	assert.deepEqual(screen.symbolStack, ['10'], "test_025");
	screen.addToStack('1');
	assert.deepEqual(screen.symbolStack, ['101'], "test_026");
	
});
QUnit.test("generalClass", function(assert) {
	// contains_decimal
	assert.strictEqual(general.string_contains_decimal_point('5.2'), true, 'true test');
	assert.strictEqual(general.string_contains_decimal_point('52'), false, 'false test');
	assert.strictEqual(general.string_contains_decimal_point('0'), false, 'zero test');
	assert.strictEqual(general.string_contains_decimal_point('-1'), false, 'negative test');
	assert.strictEqual(general.string_contains_decimal_point('5.'), true, 'nothing after decimal');
	assert.strictEqual(general.string_contains_decimal_point('5.0000'), true, 'nothing after decimal');
	
	// is_numeric	
	assert.strictEqual(general.is_numeric('5.2'), true, 'fractional number');
	assert.strictEqual(general.is_numeric('5'), true, 'whole number');
	assert.strictEqual(general.is_numeric('-5'), true, 'negative number string');
	assert.strictEqual(general.is_numeric(5), true, 'actual number');
	assert.strictEqual(general.is_numeric(-5), true, 'negative number');
	assert.strictEqual(general.is_numeric(5.), true, 'strange number');
	assert.strictEqual(general.is_numeric(0.), true, 'strange number 2');
	assert.strictEqual(general.is_numeric('25.'), true, 'strange number string');
	assert.strictEqual(general.is_numeric('0.'), true, 'strange number string 2');
	assert.strictEqual(general.is_numeric('a'), false, 'not a number');
	assert.strictEqual(general.is_numeric('25.5.5'), false, 'not a number 2');
	
	// last character is decimal
	assert.strictEqual(general.last_character_is_decimal('000'), false, "test_001");
	assert.strictEqual(general.last_character_is_decimal('5000.'), true, "test_002");
	assert.strictEqual(general.last_character_is_decimal('5.'), true, "test_003");
	assert.strictEqual(general.last_character_is_decimal(5000.5), false, "test_004");
	assert.strictEqual(general.last_character_is_decimal(100.5), false, "test_005");
	assert.strictEqual(general.last_character_is_decimal(1.5), false, "test_006");
});