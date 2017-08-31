const path = require('path')
const sprites = require('postcss-sprites')

const cwd = (...args) => path.join(__dirname, ...args)

let spriteOpt = {
	/** 样式引用的相对路径 */
	spritePath: cwd('dest'),
	/** 按文件生成雪碧图，一个文件对应一张雪碧图 */
	groupBy(image){

		var filebasename = path.basename(image.styleFilePath);
		console.log('groupBy:', filebasename.split('.')[0])
		return Promise.resolve( filebasename.split('.')[0] );
	},
	/** 只合成png，_png不做雪碧图处理 */
	filterBy(image){
		var imgbasename = path.basename(image.url);

		if (!/\.png$/.test(image.url) || imgbasename[0] === '_') {
			return Promise.reject();
		}
		return Promise.resolve();
	},
	hooks: { 
		// 雪碧图生成的路径&名字，因为这个spritePath不写也可以
		onSaveSpritesheet(opts, spritesheet){
			return cwd(`dest/${spritesheet.groups[0]}_sprite.png`);
		},
		// 自动不如宽高
		onUpdateRule(rule, token, image) {

			const { ratio, coords, spriteUrl } = image
			const { width, height } = coords

			const posX = -1 * Math.abs(coords.x / ratio);
			const posY = -1 * Math.abs(coords.y / ratio);

			token.cloneAfter({
				type: 'decl',
				prop: 'background',
				value: `url('${spriteUrl}') no-repeat ${posX}px ${posY}px`
			}).cloneAfter({
				type: 'decl',
				prop: 'width',
				value: width + "px"		
			}).cloneAfter({
				type: 'decl',
				prop: 'height',
				value: height + "px"				
			})
		}
	}
}

module.exports = {
	plugins:[sprites(spriteOpt)]
}

