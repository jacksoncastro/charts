export interface VirtualService {

    delay: number;

    target: string;

    allButTarget?: boolean;
}