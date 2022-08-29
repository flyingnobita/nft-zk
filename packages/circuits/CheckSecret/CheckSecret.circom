pragma circom 2.0.6;

include "../../../node_modules/circomlib/circuits/poseidon.circom";

// This circuit is used by the prover to prove that he knows a private input `secret` that when hashed, matches with one of the secretHashed.
// If secret is correct (defined in CheckSecret_input.json), a witness is generated.
// If secret is incorrect, an error will occured.
// Note: the Verifier can manipulate the set of secretHashed given to the prover to deduce the secret that the Prover has.
// e.g. For set of 2 secretHashed, given Hashed(a) = A, Hashed(b) = B. The verifier can give A and C to prover. If prover successfully generate a witness and a proof, then verifier knows that the prover must possess `a`. If the prover fails at generating a witness, then the verifier knows that the prover must posses `b`.
// Thus there needs to be some proof that prover can rely on which states that the hashes given are all valid
template CheckSecret() {
  // public
  signal input secretHashed1;
  signal input secretHashed2;
  signal input secretHashed3;

  // private
  signal input secret;

  // intermediate
  signal out1;
  signal out2;
  signal out3;
  signal final1;
  signal final2;

  component hasher = Poseidon(1);
  hasher.inputs[0] <== secret;  

  out1 <== (hasher.out - secretHashed1);
  out2 <== (hasher.out - secretHashed2);
  out3 <== (hasher.out - secretHashed3);

  final1 <== out1 * out2;
  final2 <== final1 * out3;

  final2 === 0;

}

component main {public [secretHashed1, secretHashed2, secretHashed3]} = CheckSecret();
