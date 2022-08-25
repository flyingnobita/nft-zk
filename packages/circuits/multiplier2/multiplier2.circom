pragma circom 2.0.0;

// This circuit is used by the prover for proving that he knows 2 factors of a number X.
// Prover will give the proof to the Verifier who will verify it with X.
// If correct, the verification will succeed.
// If incorrect, the verification will fail.
template Multiplier2() {
    signal input a;
    signal input b;
    signal output c;
    c <== a*b;
 }

 component main = Multiplier2();
 