import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
    beforeEach(async () => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        await createUserUseCase.execute({ name: 'Allyson Barros', email: 'a@a.com', password: '123456' });
    });

    it("Should be able to show a balance of the User", async () => {
        const user = await inMemoryUsersRepository.findByEmail('a@a.com');
        const response = await getBalanceUseCase.execute({ user_id: user!.id as string });

        expect(response).toHaveProperty('balance');
    });

    it("Should not be able to show a balance of wrong User", async () => {
        expect(async () => {
            const response = await getBalanceUseCase.execute({ user_id: 'abc123' });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
})