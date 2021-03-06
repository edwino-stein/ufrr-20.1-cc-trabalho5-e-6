// Verifica se está rodando pelo Node.js
var isNode = typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined';

/**
 * Classe que representa uma árvore sintática e seus nós
 */
class ArvoreSintatica {

    /**
     * Construtor da classe
     * @param {string} simbolo Símbolo que representa aquele nó na árvore
     */
    constructor (simbolo) {

        if (typeof(simbolo) !== 'string' || simbolo.length === 0) {
            throw 'O símbolo deve ser uma string não vazia'
        }

        this._simbolo = simbolo;
        this._nos = [];
    }

    /**
     * Retorna o símbolo do nó
     * @return {string}
     */
    get simbolo() { return this._simbolo; }

    /**
     * Retorna a lista de nós filhos deste nó
     * @return {[ArvoreSintatica]}
     */
    get nos() { return this._nos; }

    preOrdem (handle) {
        handle(this);
        for (const no of this._nos) no.preOrdem(handle);
    }

    posOrdem (handle) {
        handle(this);
        for (const no of this._nos.reverse()) no.posOrdem(handle);
    }

    /**
     * Cria uma árvore sinática atráves de uma lista de produções
     * @param  {[Producao]} prods Lista de produções
     * @param  {Gramatica} gram  Gramática referente as produções
     * @return {ArvoreSintatica}
     */
    static parsearProducoes (prods, gram, lado) {

        if (typeof(prods) !== 'object' || !(prods instanceof Array)) {
            throw 'As producaoções devem estar em uma lista de Producao';
        }

        if (!prods.every(i => typeof(i) === 'object')) {
            throw 'As producaoções devem estar em uma lista de Producao';
        }

        if (typeof(gram) !== 'object') {
            throw 'A gramática deve ser uma instância de Gramatica';
        }

        if(typeof(lado) !== 'string') lado = 'e';
        else lado = lado.toLowerCase();

        if (['d', 'dir', 'direita', 'r', 'right'].includes(lado)) {
            return ArvoreSintatica._parsearProducoesDir(prods, gram);
        }
        else {
            return ArvoreSintatica._parsearProducoesEsq(prods, gram)
        }
    }

    /**
     * Versão recursica da função para criar uma árvore sintática com lista de
     * produções pela esqueda
     * @param  {[Producao]} prods Lista de produções
     * @param  {Gramatica} gram  Gramática referente as produções
     * @return {ArvoreSintatica}
     */
    static _parsearProducoesEsq (prods, gram) {

        // Remove a primeira produção da lista
        const p = prods.shift();

        // Se não for válida, retorna null
        if(p === undefined) return null;

        // Cria um nó com o símbolo da cabeça da produção
        const no = new ArvoreSintatica(p.cabeca);

        // Para cada símbolo do corpo...
        for (const s of p.corpo) {

            // Se ele for um terminal, apenas cria um nó e o adiciona como filho
            if (!gram.simboloEhNaoTerminal(s)){
                no._nos.push(new ArvoreSintatica(s));
                continue;
            }

            // Se for um não terminal, chama recursivamente esta função
            const noFilho = ArvoreSintatica._parsearProducoesEsq(prods, gram);

            // Se o nó retornado for válido, adiciona-o como filho
            if(noFilho !== null) no._nos.push(noFilho);
        }

        // Retorna o nó criado
        return no;
    }

    /**
     * Versão recursica da função para criar uma árvore sintática com lista de
     * produções pela direita
     * @param  {[Producao]} prods Lista de produções
     * @param  {Gramatica} gram  Gramática referente as produções
     * @return {ArvoreSintatica}
     */
    static _parsearProducoesDir (prods, gram) {

        // Remove a primeira produção da lista
        const p = prods.shift();

        // Se não for válida, retorna null
        if(p === undefined) return null;

        // Cria um nó com o símbolo da cabeça da produção
        const no = new ArvoreSintatica(p.cabeca);

        // Para cada símbolo do corpo...
        for (const s of p.corpo.reverse()) {

            // Se ele for um terminal, apenas cria um nó e o adiciona como filho
            if (!gram.simboloEhNaoTerminal(s)){
                no._nos.unshift(new ArvoreSintatica(s));
                continue;
            }

            // Se for um não terminal, chama recursivamente esta função
            const noFilho = ArvoreSintatica._parsearProducoesDir(prods, gram);

            // Se o nó retornado for válido, adiciona-o como filho
            if(noFilho !== null) no._nos.unshift(noFilho);
        }

        // Retorna o nó criado
        return no;
    }
}

if(isNode) module.exports = ArvoreSintatica;
