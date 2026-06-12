const test = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/analyze/progression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tonalCenter: 'C',
        chords: [{ symbol: 'Dm7', chordScale: 'Dorian' }, { symbol: 'G7', chordScale: 'Mixolydian' }, { symbol: 'Cmaj7', chordScale: 'Ionian' }]
      })
    });
    console.log(res.status);
    console.log(await res.text());
  } catch (e) {
    console.error(e);
  }
};
test();
