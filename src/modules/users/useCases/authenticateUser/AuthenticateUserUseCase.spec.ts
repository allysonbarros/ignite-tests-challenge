import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticating User", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        await createUserUseCase.execute({ name: 'Allyson Barros', email: 'a@a.com', password: '123456' });
    });

    it("Should be able to authenticate a User", async () => {
        const response = await authenticateUserUseCase.execute({ email: 'a@a.com', password: '123456' });

        expect(response).toHaveProperty('token');
    });

    it("Should not be able to authenticate a User with non existing data.", async () => {
        expect(async () => {
            const response = await authenticateUserUseCase.execute({ email: 'j@a.com', password: '123456' });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("Should not be able to authenticate a User with wrong password", async () => {
        expect(async () => {
            const response = await authenticateUserUseCase.execute({ email: 'a@a.com', password: '1234' });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
})