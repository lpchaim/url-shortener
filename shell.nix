with import <nixpkgs> {
  overlays = [
    (final: prev: {
      nodejs = prev.nodejs-18_x;
    })
  ];
};

mkShell {
  buildInputs = [
    node2nix
    nodejs
    nushell
    sqlite
  ];
  shellHook = ''
    exec nu
  '';
}
