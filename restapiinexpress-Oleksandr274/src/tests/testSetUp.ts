import { closeDb, initDb } from "../database";

beforeAll(async () => {
  console.log('Running bofore all')
  console.log = () => { };
  await initDb();

});

afterAll(async () => {
  console.log = console.log;
    await closeDb();
});
