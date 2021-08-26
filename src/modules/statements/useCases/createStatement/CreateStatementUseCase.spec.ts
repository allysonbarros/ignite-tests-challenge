import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { OperationType } from "../../entities/Statement";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
    beforeEach(async () => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        await createUserUseCase.execute({ name: 'Allyson Barros', email: 'a@a.com', password: '123456' });
    });

    it("Should be able to make a deposit on User's account", async () => {
        const user = await inMemoryUsersRepository.findByEmail('a@a.com');

        await createStatementUseCase.execute({
            user_id: user!.id as string,
            type: OperationType.DEPOSIT,
            amount: 100.0,
            description: 'Payment'
        });

        const { balance } = await inMemoryStatementsRepository.getUserBalance({ user_id: user!.id as string })

        expect(balance).toEqual(100);
    });

    it("Should be able to make a withdraw on User's account", async () => {
        const user = await inMemoryUsersRepository.findByEmail('a@a.com');

        await createStatementUseCase.execute({
            user_id: user!.id as string,
            type: OperationType.DEPOSIT,
            amount: 100.0,
            description: 'Payment'
        });

        await createStatementUseCase.execute({
            user_id: user!.id as string,
            type: OperationType.WITHDRAW,
            amount: 75.0,
            description: 'Payment'
        });

        const { balance } = await inMemoryStatementsRepository.getUserBalance({ user_id: user!.id as string })

        expect(balance).toEqual(25);
    });

    it("Should be able to make a deposit on wrong User's account", async () => {
        expect(async () => {
            const response = await createStatementUseCase.execute({
                user_id: '1',
                type: OperationType.DEPOSIT,
                amount: 100.0,
                description: 'Payment'
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("Should not be able to make a withdraw on User's account with insuffient funds", async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.findByEmail('a@a.com');

            await createStatementUseCase.execute({
                user_id: user!.id as string,
                type: OperationType.WITHDRAW,
                amount: 15.0,
                description: 'Payment'
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
})